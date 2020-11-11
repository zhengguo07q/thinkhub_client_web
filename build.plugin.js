module.exports = ({ onGetWebpackConfig }) => {
    onGetWebpackConfig((config) => {
        config.node.set('fs', 'empty');
    });
}