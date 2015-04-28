module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'less:dev',
		// 'autoprefixer:single_file',
		'copy:dev',
		'coffee:dev'
	]);
};
