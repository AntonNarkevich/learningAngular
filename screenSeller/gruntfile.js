'use strict';

module.exports = function (grunt) {

	var jsFiles = ['app/js/**/*.js', 'gruntfile.js'];

	grunt.initConfig({
		jslint: {
			client: {
				src: jsFiles,
				directives: {
					white: true,
					vars: true,
					nomen: true,
					browser: true,
					todo: true,
					unparam: true,
					node: true
				}
			}
		},
		watch: {
			files: jsFiles,
			tasks: ['jslint']
		},
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				commit: false,
				push: false,
				createTag: false
			}
		},
		shell: {
			run: {
				command: 'npm start'
			}
		}
	});

	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('dev', ['jslint', 'bump:patch', 'shell']);

	grunt.registerTask('default', 'watch');
};