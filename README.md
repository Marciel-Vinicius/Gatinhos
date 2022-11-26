# CRUD Gatos

## Banco de dados:
- Utilizar MySQL 8.0.31
- Executar o script 'banco.sql' para criar o banco;

## Executar o projeto (desenvolvimento):
```
npm run dev
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