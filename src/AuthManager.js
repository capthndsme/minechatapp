import axios from "axios";
export function doLogout() {
  return new Promise(function (resolve, reject) {
    let params = new URLSearchParams();
    params.append("username", localStorage.getItem("username"));
    params.append("sessionid", localStorage.getItem("session_id"));
    axios
      .post("/logout/", params)
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
      localStorage.getItem("session_id") === null
    ) {
      console.log("error at authmgr");
      resolve(false);
    } else {
      let params = new URLSearchParams();
      params.append("username", localStorage.getItem("username"));
      params.append("sessionid", localStorage.getItem("session_id"));
      axios
        .post("https://rphvccraft.capthndsme.xyz/verifySession/", params)
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
export function sendMessage(msg, channel) {
  return new Promise(function (resolve, reject) {
    if (
      localStorage.getItem("username") === null ||
      localStorage.getItem("session_id") === null
    ) {
      console.log("error at authmgr");
      resolve({"state":"error", "error": "No Login Key"});
    } else {
      let params = new URLSearchParams();
      params.append("username", localStorage.getItem("username"));
      params.append("sessionid", localStorage.getItem("session_id"));
      params.append("channel", channel);
      params.append("message", msg);
      axios
        .post("https://rphvccraft.capthndsme.xyz/sendMessage/", params)
        .then(function (res) {
          resolve(res.data);
        });
    }
  });
}
export function getUsername() {
  return localStorage.getItem("username"); 
}
export function loginVerify(username, password) {
  console.log("[AuthManager] Logging in", username)
  return new Promise(function (resolve, reject) {
    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    axios
      .post("https://rphvccraft.capthndsme.xyz/authenticate/", params)
      .then(function (data) {
        console.log("Authenticator Login", data);
        if (data.data.state === "success") {

          localStorage.setItem("username", data.data.username);
          localStorage.setItem("session_id", data.data.sessionid);
        }
        resolve(data);
      })
      .catch(function (error) {});
  });
}

 