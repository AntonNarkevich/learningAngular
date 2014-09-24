/*global angular, gapi, AWS, Stripe*/
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.factory('UserService', function ($q, $http, AWSService, StripeService) {
		var service = {
			_user: null,
			UsersTable: 'Users',
			UserItemsTable: 'UserItems',
			setCurrentUser: function (u) {
				if (u && !u.error) {
					AWSService.setToken(u.id_token);
					return service.currentUser();
				}

				var d = $q.defer();
				d.reject(u.error);
				return d.promise;
			},
			currentUser: function () {
				var d = $q.defer();

				if (service._user) {
					d.resolve(service._user);
				} else {
					AWSService.credentials().then(function () {
						gapi.client.oauth2.userinfo.get()
							.execute(function (e) {
								var email = e.email;

								AWSService.dynamo({
									params: {TableName: service.UsersTable}
								})
									.then(function (table) {
										table.getItem({
											Key: {'User email': {S: email}}
										}, function (err, data) {
											if (Object.keys(data).length === 0) {
												var itemParams = {
													Item: {
														'User email': {S: email},
														data: {S: JSON.stringify(e)}
													}
												};

												table.putItem(itemParams, function (err, data) {
													service._user = e;
													d.resolve(e);
												});
											} else {
												service._user = JSON.parse(data.Item.data.S);
												d.resolve(service._user);
											}
										});
									});
							});
					});
				}
				return d.promise;
			},
			Bucket: 'screen-seller-bucket',
			uploadItemForSale: function (items) {
				var d = $q.defer();

				service.currentUser().then(function (user) {
					AWSService.s3({
						params: {
							Bucket: service.Bucket
						}
					}).then(function (s3) {
						var file = items[0];

						var params = {
							Key: file.name,
							Body: file,
							ContentType: file.type
						};

						s3.putObject(params, function (err, data) {
							if (!err) {
								var getUrlParams = {
									Bucket: service.Bucket,
									Key: file.name,
									Expires: 900 * 4
								};

								s3.getSignedUrl('getObject', getUrlParams, function (err, url) {
									AWSService.dynamo({params: {TableName: service.UserItemsTable}})
										.then(function (table) {
											var itemParams = {
												Item: {
													'ItemId': {S: file.name},
													'User email': {S: user.email},
													data: {
														S: JSON.stringify({
															itemId: file.name,
															itemSIze: file.size,
															itemUrl: url
														})
													}
												}
											};

											table.putItem(itemParams, function (err, data) {
												d.resolve(data);
											});
										});
								});
							}
						});
					});
				});

				return d.promise;
			},
			itemsForSale: function () {
				var d = $q.defer();

				service.currentUser().then(function (user) {
					AWSService.dynamo({
						params: {TableName: service.UserItemsTable}
					}).then(function (table) {
						table.query({
							TableName: service.UserItemsTable,
							KeyConditions: {
								'User email': {
									'ComparisonOperator': 'EQ',
									'AttributeValueList': [
										{S: user.email}
									]
								}
							}
						}, function (err, data) {
							var items = [];

							if (data) {
								angular.forEach(data.Items, function (item) {
									items.push(JSON.parse(item.data.S));
								});

								d.resolve(items);
							} else {
								d.reject(err);
							}
						});
					});
				});

				return d.promise;
			},
			ChargeTable: 'UserCharges',
			createPayment: function (item, charge) {
				var d = $q.defer();

				StripeService.createCharge(charge)
					.then(function (data) {
						var stripeToken = data.id;

						AWSService.sqs({QueueName: service.ChargeTable})
							.then(function (sqsInfo) {
								sqsInfo.sqs.sendMessage({
									QueueUrl: sqsInfo.url,
									MessageBody: JSON.stringify({
										item: item,
										stripetoken: stripeToken,
									})
								}, function (err, data) {
									d.resolve(data);
								});
							});
					}, function (err) {
						d.reject(err);
					});

				return d.promise;
			}
		};

		return service;
	})


	.provider('AWSService', function () {
		var self = this;
		self.arn = null;


		self.setArn = function (arn) {
			if (arn) {
				self.arn = arn;
			}
		};

		self.$get = function ($q, $cacheFactory) {
			var sqsCache = $cacheFactory('sqs'),
				s3Cache = $cacheFactory('s3Cache'),
				dynamoCache = $cacheFactory('dynamo'),
				credentialsDefer = $q.defer(),
				credentialsPromise = credentialsDefer.promise;

			return {
				credentials: function () {
					return credentialsPromise;
				},
				setToken: function (token, providerId) {
					var config = {
						RoleArn: self.arn,
						WebIdentityToken: token,
						RoleSessionName: 'web-id'
					};

					if (providerId) {
						config.ProviderId = providerId;
					}

					self.config = config;

					AWS.config.credentials = new AWS.WebIdentityCredentials(config);
					credentialsDefer.resolve(AWS.config.credentials);
				},
				dynamo: function (params) {
					var d = $q.defer();

					credentialsPromise.then(function () {
						if (!params.region) {
							params.region = 'us-west-2';
						}

						var table = dynamoCache.get(JSON.stringify(params));

						if (!table) {
							table = new AWS.DynamoDB(params);
							dynamoCache.put(JSON.stringify(params), table);
						}

						d.resolve(table);
					});

					return d.promise;
				},
				s3: function (params) {
					var d = $q.defer();

					credentialsPromise.then(function () {
//						if (!params.region) {
//							params.region = 'us-west-2';
//						}

						var s3Obj = s3Cache.get(JSON.stringify(params));

						if (!s3Obj) {
							s3Obj = new AWS.S3(params);
							s3Cache.put(JSON.stringify(params), s3Obj);
						}

						d.resolve(s3Obj);
					});

					return d.promise;
				},
				sqs: function (params) {
					var d = $q.defer();

					credentialsPromise.then(function () {

						var url = sqsCache.get(JSON.stringify(params)),
							queued = $q.defer();

						if (!url) {
							var sqs = new AWS.SQS({region: 'us-west-2'});
							sqs.getQueueUrl(params, function (err, data) {
								if (data) {
									url = data.QueueUrl;
									sqsCache.put(JSON.stringify(params), url);
									queued.resolve(url);
								} else {
									queued.reject(err);
								}
							});
						} else {
							queued.resolve(url);
						}

						queued.promise.then(function (url) {
							var queue = new AWS.SQS({QueueUrl: url, region: 'us-west-2'});
							d.resolve({sqs: queue, url: url});
						});
					});

					return d.promise;
				}
			};
		};
	})


	.provider('StripeService', function () {
		var self = this;

		self.setPublishableKey = function (key) {
			Stripe.setPublishableKey(key);
		};

		self.$get = function ($q) {
			return {
				createCharge: function (obj) {
					var d = $q.defer();

					if (!obj.hasOwnProperty('number') || !obj.hasOwnProperty('cvc') || !obj.hasOwnProperty('exp_month') || !obj.hasOwnProperty('exp_year')) {
						d.reject('Bad input', obj);
					} else {
						Stripe.card.createToken(obj, function (status, resp) {
							if (status === 200) {
								d.resolve(resp);
							} else {
								d.reject(status);
							}
						});
					}

					return d.promise;
				}
			};
		};
	});
