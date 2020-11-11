var webpackConfig = {
    node :{
        fs: 'empty'
    }
}
module.exports = ({context ,onGetWebpackConfig, registerTask}) => {
    console.log(context);
    registerTask('default', webpackConfig);
  
  }