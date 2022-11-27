# CRUD Gatos
Node: v18.12.1
## Banco de dados:
- Utilizar MySQL 8.0.31
- Executar o script 'banco.sql' para criar o banco;

## Executar o projeto (desenvolvimento):
```
npm install
npm run dev
```

## Executar o projeto (produção):
```
npm install
npm run build
npm run start
```

## API:
### Endpoints:
Buscar todos os gatos:
```ts
GET /api/gatos
```

Buscar gato por ID:
```ts
GET /api/gatos/[id]
```

Cadastrar gato:
```js
POST /api/gatos

//Body:
{
    "nome": nome,
    "raca": raca,
    "peso": peso,
    "data_nascimento": data_nascimento
}
```

Atualizar gato:
```ts
PUT /api/gatos

//Body:
{   
    "id", id,
    "nome": nome,
    "raca": raca,
    "peso": peso,
    "data_nascimento": data_nascimento
}
```

Deletar gato:
```ts
DELETE /api/gatos

//Body:
{
    "id": id
}
```