module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'jst:dev',
		'less:dev',
		// 'autoprefixer:single_file',
		'sync:dev',
		'coffee:dev'
	]);
};
