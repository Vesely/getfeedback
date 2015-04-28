/**
 * Autoprefixer parses CSS and adds vendor-prefixed CSS properties using the Can I Use database.
 *
 *
 * For usage docs see:
 * 		https://github.com/nDmitry/grunt-autoprefixer
 */
module.exports = function(grunt) {

	grunt.config.set('autoprefixer', {
		options: {
			browsers: ['last 2 version', 'ie 8', 'ie 7']
		},
		single_file: {
			files: [{
				expand: true,
				cwd: '.tmp/public/styles/',
				src: ['importer.css'],
				dest: '.tmp/public/styles/',
				ext: '.css'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
};
