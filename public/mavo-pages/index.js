(function ($) {

	Mavo.Plugins.register("cfpages");
	let _ = Mavo.Backend.register(class CFPages extends Mavo.Backend {
		id = "cfpages"
		constructor(url, o) {
			super(url, o);
			this.permissions.on(["login", "read"]);
			this.sessionUrl = new URL('/auth/session', this.url.origin);
			this.loginUrl = new URL('/auth/signin', this.url.origin);
			this.logoutUrl = new URL('/auth/signout', this.url.origin);
			this.fileUrl = new URL('/files', this.url.origin);
			this.key = this.options.key || "justsomerandomkey";
			this.user = null;
			this.login(true);
		}

		async put(serialized, path = this.path, o = {}) {
			return this.request(this.url, serialized, "PUT", {
				headers: {
					"content-type": "application/json",
					"cfpages-kv-key": this.key,
				}
			});
		}

		async get() {
			return this.request(this.url, null, "GET", {
				headers: {
					"content-type": "application/json",
					"cfpages-kv-key": this.key,
				}
			});
		}

		async upload(file, path) {
			let result = await this.request(this.fileUrl, file, "POST", {
				headers: {
					"content-type": file.type,
					"cfpages-r2-path": path,
				}
			});
			return result.path;
		}

		async getUser() {
			if (this.user) {
				return this.user;
			}
			let session = await this.request(this.sessionUrl);
			if (session && session.user) {
				return session.user
			}
			return null;
		}

		async login(passive) {
			if (passive) {
				this.user = await this.getUser();
				if (this.user) {
					this.permissions.logout = true;
					this.permissions.on(["edit", "save"]);
				}
			} else {
				return window.location.href = this.loginUrl;
			}
		}

		logout() {
			return window.location.href = this.logoutUrl;
		}

		static test(value){
			return value === "/api/mavo";
		}
	});

})(Bliss);