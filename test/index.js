var should = require('should');
var assert = require('assert');
var Mode = require('stat-mode');
var stat = require('../index');

var testdir = require('path').join(__dirname, 'files');
var nodir = require('path').join(__dirname, 'hello-world');
function noop() {}

describe('folder-stat', function() {
	it('should fail when arguments are missing', function() {
		(function() { stat(); }).should.throw();
		(function() { stat(testdir); }).should.throw();
	});

	it('should not fail when arguments are not missing', function() {
		(function() { stat(testdir, noop); }).should.not.throw();
		(function() { stat(testdir, noop, 10); }).should.not.throw();
	});

	it('should fail when given a nonexistant directory', function(done) {
		stat(nodir, function(err, stats) {
			err.should.be.an.Error;
			(stats === undefined).should.be.true;
			done();
		});
	});

	it('should return the correct stats', function(done) {
		stat(testdir, function(err, stats, files) {
			(err === null).should.be.true;
			stats.should.be.an.Array;
			files.should.be.an.Array;
			stats.length.should.eql(files.length).and.eql(4);

			files.should.containEql('dir1').and.containEql('file1').and.containEql('symlink1').and.containEql('symlink2');
			var dir1Idx = files.indexOf('dir1');
			var file1Idx = files.indexOf('file1');
			var symlink1Idx = files.indexOf('symlink1');
			var symlink2Idx = files.indexOf('symlink2');
			var dir1Stat = stats[dir1Idx];
			var file1Stat = stats[file1Idx];
			var symlink1Stat = stats[symlink1Idx];
			var symlink2Stat = stats[symlink2Idx];
			var dir1Mode = new Mode(dir1Stat);
			var file1Mode = new Mode(file1Stat);
			var symlink1Mode = new Mode(symlink1Stat);
			var symlink2Mode = new Mode(symlink2Stat);

			dir1Stat.should.be.an.Object;
			file1Stat.should.be.an.Object;
			symlink1Stat.should.be.an.Object;

			dir1Mode.isDirectory().should.be.true;
			dir1Mode.isFile().should.be.false;
			dir1Stat.isSymbolicLink().should.be.false;

			file1Mode.isDirectory().should.be.false;
			file1Mode.isFile().should.be.true;
			file1Stat.isSymbolicLink().should.be.false;

			symlink1Mode.isDirectory().should.be.false;
			symlink1Mode.isFile().should.be.false;
			symlink1Stat.isSymbolicLink().should.be.true;

			symlink2Mode.isDirectory().should.be.false;
			symlink2Mode.isFile().should.be.false;
			symlink2Stat.isSymbolicLink().should.be.true;

			// This doesn't verify any part of the mode except for the type
			// because on other platforms/filesystems they may not be the same.
			done();
		});
	});
});
