const gulp = require('gulp'); 
const cleanCSS = require('gulp-clean-css'); // очистка и минимизация кода
const sourcemaps = require('gulp-sourcemaps'); //создание карты источников для дебага css
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer'); // расстановка вендорных префиксов
const sass = require('gulp-sass'); 
const del = require('del'); // плагин удаления папок и файлов 
sass.compiler = require('node-sass');
const apppath = './build/mv-library/src/';
const buildpath = './build/mv-library/';

/* Функция таска для оптимизации и преобразования нашего scss */
function styles(){
	return gulp.src(apppath + 'scss/**/*.scss') /* берем источник ищет *.scss во всех вложенных дирректориях */
	/* .pipe() - преобразования пакета через вызов модулей gulp */
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['>0.1%'],
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write()) /* вывод карты источника если без параметров то прямо в CSS файл - для нормально работы со стилями из Chrome DevTool */
		.pipe(gulp.dest(buildpath + 'css')); /* вывод файлов в папку назначения */
}


/* функция таска для работы со скриптами  */
function scripts() { 
  return gulp.src(apppath + 'js/**/*.js')
  //  .pipe(sourcemaps.init()) // не понятно, что он должен делать с JS  кодом 1
    .pipe(babel({
		presets: ['@babel/env'] //применяем пресет
		}))
    .pipe(concat("mv-library.js")) // соединяем все js файлы в один mv-library.js
	.pipe(uglify({
						toplevel: true
						}	)) // Сжимаем JS файл c наибольшей степенью оптимизации - когда даже переменные сокращаются
//    .pipe(sourcemaps.write(".")) // не понятно, что он должен делать с JS  кодом 1
    .pipe(gulp.dest(buildpath +"js")); //сохраняем итоговый проект
};

/* функция таска вотчера */
function watch(){
	gulp.watch(apppath + 'scss/**/*.scss' , styles); /*  следим за стилями */
	gulp.watch(apppath + 'js/**/*.js' , scripts);	/*  следим за скриптами */
}

/*  таск для работы со стилями  */
gulp.task('styles', styles);  
/*  таск для работы со скриптами  */
gulp.task('scripts', scripts); 
/* Таск для запуска совокупного вотчера */
gulp.task('watch', watch); 

/* Особый таск для сборки проекта с предварительной очисткой папок */
gulp.task('build', gulp.parallel( styles, scripts ) )	;