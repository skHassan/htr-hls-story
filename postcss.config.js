
module.exports = {
    plugins: [
        require('autoprefixer'),  // Adds vendor prefixes like -webkit-, -moz-, etc.
        require('cssnano')        // Minifies the CSS for production
    ]
}
