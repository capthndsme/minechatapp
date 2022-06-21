import axios from "axios";
export function doLogout() {
  return new Promise(function (resolve, reject) {
    let params = new URLSearchParams();
    params.append("username", localStorage.getItem("username"));
    params.append("sessionid", localStorage.getItem("sessionid"));
    axios
      .post("http://localhost/craftMote/logout/", params)
      .then(function (res) {
        localStorage.removeItem("username");
        localStorage.removeItem("session_id");
        resolve(true);
      })
      .catch(function (err) {
        localStorage.removeItem("username");
        localStorage.removeItem("session_id");
        resolve(true); // We dont care. We still cleared the data.
      });
  });
}
export function isAutenticated() {
  return new Promise(function (resolve, reject) {
    if (
      localStorage.getItem("username") === null ||
      localStorage.getItem("session_id")
    ) {
      resolve(false);
    } else {
      let params = new URLSearchParams();
      params.append("username", localStorage.getItem("username"));
      params.append("sessionid", localStorage.getItem("sessionid"));
      axios
        .post("http://localhost/craftMote/verifySession/", params)
        .then(function (res) {
          if (res.data.state === "success") {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    }
  });
}
export function getUsername() {
  return localStorage.getItem("username");
}
export function loginVerify(username, password, captchaKey) {
  return new Promise(function (resolve, reject) {
    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("captcha_key", captchaKey);

    axios
      .post("http://localhost/craftMote/authenticate/", params)
      .then(function (data) {
        if (data.data.state === "success") {
          localStorage.setItem("username", data.data.username);
          localStorage.setItem("sessionid", data.data.sessionid);
        }
        resolve(data);
      })
      .catch(function (error) {});
  });
}
