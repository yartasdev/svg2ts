module.exports = [
  {
    target: 'svg/target/anron',
    output: 'svg/output/anron', 
    prefix: 'ar',
    svgo: {
      plugins: [
        'removeDimensions',
        {
          name: "convertColors",
          params: {
            currentColor: true,
          }
        }
      ]
    }
  }
]