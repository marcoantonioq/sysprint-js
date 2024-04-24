import ActiveDirectory from "activedirectory2";
import jwt from "jsonwebtoken";

export class ADAuthentication {
  private ad: ActiveDirectory;
  private secretKey = "";

  constructor({
    host = "",
    baseDN = "",
    username = "",
    password = "",
    secretKey = "secretKey",
  }) {
    this.secretKey = secretKey;
    this.ad = new ActiveDirectory({
      url: `ldap://${host}`,
      baseDN,
      username,
      password,
    });
  }

  async authenticate(username: string, password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.ad.authenticate(username, password, (err, auth) => {
        if (err) {
          reject(err);
          return;
        }
        if (auth) {
          try {
            const token = jwt.sign({ username }, this.secretKey, {
              expiresIn: "1h",
            });
            resolve(token);
          } catch (error) {
            console.log("Erro ao gerar token: ", this.secretKey, error);
            reject(error);
          }
        } else {
          reject("Usuário ou senha inválida!");
        }
      });
    });
  }

  async validToken(token: string) {
    return new Promise<boolean>((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          // console.error("Erro ao verificar token:", err.message);
          resolve(false);
        } else {
          // console.log("Token válido:", decoded);
          resolve(true);
        }
      });
    });
  }
}
