module.exports = [
  {
    target: 'svg/target',
    output: 'svg/output', 
    prefix: 'pg',
    svgo: {
      plugins: ['removeDimensions']
    }
  }
]