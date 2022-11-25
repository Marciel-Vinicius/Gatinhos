# Programação IV
- Id
- Nome
- Data nascimento
- Raça
- Peso


```sql
create table gato(
    id int primary key auto_increment,
    nome varchar(100) not null,
    raca varchar(100) not null,
    peso numeric(5,2),
    data_nascimento date not null
)

```