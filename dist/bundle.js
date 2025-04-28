/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ (() => {

eval("$(\"#menu-controller, #close-right-pad\").click(function (event) {\n  $(\"#right-menu\").css(\"right\");\n  switch ($(\"#right-menu\").css(\"right\")) {\n    case \"0px\":\n      $(\"#right-menu\").css(\"right\", \"-100%\");\n      break;\n    default:\n      $(\"#right-menu\").css(\"right\", \"0px\");\n      break;\n  }\n});\ncheckBoxLists = [\"actiavate-remove-circle-btn\", \"actiavate-adding-btn\", \"actiavate-selecting-btn\"];\n$(\"#actiavate-selecting-btn\").click(activatorsFunction);\n$(\"#actiavate-adding-btn\").click(activatorsFunction);\n$(\"#actiavate-remove-circle-btn\").click(activatorsFunction);\nfunction activatorsFunction(event) {\n  id = $(this)[0].id;\n  for (var index = 0; index < checkBoxLists.length; index++) {\n    var element = checkBoxLists[index];\n    if ($(this)[0].id !== element) {\n      $(\"#\" + element).prop(\"checked\", false);\n    }\n  }\n}\n$(\"#upload-graph-button\").click(function (event) {\n  $(\"#upload-graph-input\").trigger(\"click\");\n});\n$(\"#upload-graph-button\").click(function (evnet) {});\n$.ajax({\n  type: \"POST\",\n  url: \"/graphs_scripts/SaveGraph\",\n  data: {\n    new1: \"new\"\n  },\n  dataType: \"json\",\n  success: function success(response) {\n    console.log(response);\n  },\n  error: function error(_error) {\n    console.log(_error);\n  }\n});\n\n//# sourceURL=webpack://betweenness/./main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./main.js"]();
/******/ 	
/******/ })()
;