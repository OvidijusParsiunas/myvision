module.exports = {
    "extends": "airbnb-base",
    rules:{
      "linebreak-style": 0,
      "no-underscore-dangle": 0,
      "no-param-reassign": 0,
      "import/no-unresolved": [2, {ignore: ['fabric']}],
      "prefer-destructuring": ["error",{"object": true, "array": false}],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    "env": {
      "browser": true
    }
};
