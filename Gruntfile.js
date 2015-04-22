module.exports = function (grunt)
{
	grunt.initConfig({

		pkg : grunt.file.readJSON('package.json'),

		jshint :
		{
			files :
			{
				src : ['src/scrollclass.js']
			}
		},

		uglify :
		{	
			options: 
			{
      			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
       					 '<%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author %> */\n'
    		},
			build :
			{
				files :
				{
					'dist/scrollclass.min.js' : ['src/scrollclass.js']
				}
			}
		},

		copy :
		{
			build :
			{
				src : ['src/scrollclass.js'], dest : 'dist/scrollclass.js'
			}
		},

		watch :
		{
			scripts :
			{
				files : ['src/scrollclass.js'],
				tasks : ['jshint','uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
};