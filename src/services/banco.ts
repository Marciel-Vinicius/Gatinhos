import mysql from 'mysql2';

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "84365646",
  database: "gatinhos",
});

export function select(){
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM gato";
        db.query(query, (err: Error, result: Object) => {
            if (err) reject(err);
            resolve(result);
        })
    });
};

export function insert(nome: string, raca: string, peso: string, data_nascimento: string){
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO gato (nome, raca, peso, data_nascimento) VALUES ('${nome}', '${raca}', ${peso}, '${data_nascimento}')`;
        db.query(query, (err: Error, result: Object) => {
            if (err) reject(err);
            resolve(result);
        })
    });
};

export function update(id: string, nome: string, raca: string, peso: string, data_nascimento: string){
    return new Promise((resolve, reject) => {
        let query = `UPDATE gato SET nome = '${nome}', raca = '${raca}', peso = ${peso}, data_nascimento = '${data_nascimento}' WHERE id = ${id}`;
        db.query(query, (err: Error, result: Object) => {
            if (err) reject(err);
            resolve(result);
        }
    )});
};

export function remove(id: string){
    return new Promise((resolve, reject) => {
        let query = `DELETE FROM gato WHERE id = ${id}`;
        db.query(query, (err: Error, result: Object) => {
            if (err) reject(err);
            resolve(result);
        }
    )});
};

