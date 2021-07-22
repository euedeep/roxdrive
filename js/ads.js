(function(window) {
	var BlogAvBloX = function(options) {
		this._options = {
			checkOnLoad:		false,
			resetOnEnd:			false,
			loopCheckTime:		50,
			loopMaxNumber:		5,
			baitClass:			'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
			baitStyle:			'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;',
			debug:				false
		};
		this._var = {
			version:			'3.2.3',
			bait:				null,
			checking:			false,
			loop:				null,
			loopNumber:			0,
			event:				{ terdeteksi: [], tdkTerdeteksi: [] }
		};
		if(options !== undefined) {
			this.setOption(options);
		}
		var self = this;
		var eventCallback = function() {
			setTimeout(function() {
				if(self._options.checkOnLoad === true) {
					if(self._options.debug === true) {
						self._log('onload->eventCallback', 'Loading cek diluncurkan');
					}
					if(self._var.bait === null) {
						self._buatUmpan();
					}
					setTimeout(function() {
						self.check();
					}, 1);
				}
			}, 1);
		};
		if(window.addEventListener !== undefined) {
			window.addEventListener('load', eventCallback, false);
		} else {
			window.attachEvent('onload', eventCallback);
		}
	};
	BlogAvBloX.prototype._options = null;
	BlogAvBloX.prototype._var = null;
	BlogAvBloX.prototype._bait = null;
	
	BlogAvBloX.prototype._log = function(method, message) {
		console.log('[BlogAvBloX]['+method+'] '+message);
	};
	
	BlogAvBloX.prototype.setOption = function(options, value) {
		if(value !== undefined) {
			var key = options;
			options = {};
			options[key] = value;
		}
		for(var option in options) {
			this._options[option] = options[option];
			if(this._options.debug === true) {
				this._log('setOption', 'Pilihan "'+option+'" ditugaskan untuk "'+options[option]+'"');
			}
		}
		return this;
	};
	
	BlogAvBloX.prototype._buatUmpan = function() {
		var bait = document.createElement('div');
			bait.setAttribute('class', this._options.baitClass);
			bait.setAttribute('style', this._options.baitStyle);
		this._var.bait = window.document.body.appendChild(bait);
		
		this._var.bait.offsetParent;
		this._var.bait.offsetHeight;
		this._var.bait.offsetLeft;
		this._var.bait.offsetTop;
		this._var.bait.offsetWidth;
		this._var.bait.clientHeight;
		this._var.bait.clientWidth;
		
		if(this._options.debug === true) {
			this._log('_buatUmpan', 'Umpan dibuat');
		}
	};
	BlogAvBloX.prototype._hapusUmpan = function() {
		window.document.body.removeChild(this._var.bait);
		this._var.bait = null;
		
		if(this._options.debug === true) {
			this._log('_hapusUmpan', 'Umpan dihapus');
		}
	};
	
	BlogAvBloX.prototype.check = function(loop) {
		if(loop === undefined) {
			loop = true;
		}
		
		if(this._options.debug === true) {
			this._log('check', 'Audit diminta '+(loop===true?'dengan':'tanpa')+' loop');
		}
		
		if(this._var.checking === true) {
			if(this._options.debug === true) {
				this._log('check', 'Cek dibatalkan karena sudah ada yang sedang berlangsung');
			}
			return false;
		}
		this._var.checking = true;
		
		if(this._var.bait === null) {
			this._buatUmpan();
		}
		
		var self = this;
		this._var.loopNumber = 0;
		if(loop === true) {
			this._var.loop = setInterval(function() {
				self._cekUmpan(loop);
			}, this._options.loopCheckTime);
		}
		setTimeout(function() {
			self._cekUmpan(loop);
		}, 1);
		if(this._options.debug === true) {
			this._log('check', 'Pengecekan sedang berlangsung ...');
		}
		
		return true;
	};
	BlogAvBloX.prototype._cekUmpan = function(loop) {
		var terdeteksi = false;
		
		if(this._var.bait === null) {
			this._buatUmpan();
		}
		
		if(window.document.body.getAttribute('abp') !== null
		|| this._var.bait.offsetParent === null
		|| this._var.bait.offsetHeight == 0
		|| this._var.bait.offsetLeft == 0
		|| this._var.bait.offsetTop == 0
		|| this._var.bait.offsetWidth == 0
		|| this._var.bait.clientHeight == 0
		|| this._var.bait.clientWidth == 0) {
			terdeteksi = true;
		}
		if(window.getComputedStyle !== undefined) {
			var baitTemp = window.getComputedStyle(this._var.bait, null);
			if(baitTemp && (baitTemp.getPropertyValue('display') == 'none' || baitTemp.getPropertyValue('visibility') == 'hidden')) {
				terdeteksi = true;
			}
		}
		
		if(this._options.debug === true) {
			this._log('_cekUmpan', 'Cek ('+(this._var.loopNumber+1)+'/'+this._options.loopMaxNumber+' ~'+(1+this._var.loopNumber*this._options.loopCheckTime)+'ms) dilakukan dan deteksi adalah '+(terdeteksi===true?'positive':'negative'));
		}
		
		if(loop === true) {
			this._var.loopNumber++;
			if(this._var.loopNumber >= this._options.loopMaxNumber) {
				this._hentikanLoop();
			}
		}
		
		if(terdeteksi === true) {
			this._hentikanLoop();
			this._hapusUmpan();
			this.emitEvent(true);
			if(loop === true) {
				this._var.checking = false;
			}
		} else if(this._var.loop === null || loop === false) {
			this._hapusUmpan();
			this.emitEvent(false);
			if(loop === true) {
				this._var.checking = false;
			}
		}
	};
	BlogAvBloX.prototype._hentikanLoop = function(terdeteksi) {
		clearInterval(this._var.loop);
		this._var.loop = null;
		this._var.loopNumber = 0;
		
		if(this._options.debug === true) {
			this._log('_hentikanLoop', 'Pengulangan sudah di stop');
		}
	};
	
	BlogAvBloX.prototype.emitEvent = function(terdeteksi) {
		if(this._options.debug === true) {
			this._log('emitEvent', 'Event '+(terdeteksi===true?'positive':'negative')+' deteksi was called');
		}
		
		var fns = this._var.event[(terdeteksi===true?'terdeteksi':'tdkTerdeteksi')];
		for(var i in fns) {
			if(this._options.debug === true) {
				this._log('emitEvent', 'Call function '+(parseInt(i)+1)+'/'+fns.length);
			}
			if(fns.hasOwnProperty(i)) {
				fns[i]();
			}
		}
		if(this._options.resetOnEnd === true) {
			this.clearEvent();
		}
		return this;
	};
	BlogAvBloX.prototype.clearEvent = function() {
		this._var.event.terdeteksi = [];
		this._var.event.tdkTerdeteksi = [];
		
		if(this._options.debug === true) {
			this._log('clearEvent', 'Event list telah dihapus');
		}
	};
	
	BlogAvBloX.prototype.on = function(terdeteksi, fn) {
		this._var.event[(terdeteksi===true?'terdeteksi':'tdkTerdeteksi')].push(fn);
		if(this._options.debug === true) {
			this._log('on', 'Event "'+(terdeteksi===true?'terdeteksi':'tdkTerdeteksi')+'" ditambahkan');
		}
		
		return this;
	};
	BlogAvBloX.prototype.onDetected = function(fn) {
		return this.on(true, fn);
	};
	BlogAvBloX.prototype.onNotDetected = function(fn) {
		return this.on(false, fn);
	};
	
	window.BlogAvBloX = BlogAvBloX;
	
	if(window.blogAvBloX === undefined) {
		window.blogAvBloX = new BlogAvBloX({
			checkOnLoad: true,
			resetOnEnd: true
		});
	}
})(window);
