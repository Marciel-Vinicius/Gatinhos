import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState } from 'react';
import { Form, Input, Button, Space, Typography, Modal, Table, DatePicker, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Home() {
  const apiUrl = 'http://localhost:3000/api/gatos';

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const [isModalBuscarOpen, setIsModalBuscarOpen] = useState(false);
  const [isModalCadastrarOpen, setIsModalCadastrarOpen] = useState(false);
  const [isModalAtualizarOpen, setIsModalAtualizarOpen] = useState(false);
  const [isModalDeletarOpen, setIsModalDeletarOpen] = useState(false);

  const [contentModalBuscar, setContentModalBuscar] = useState<any>();
  const [contentModalCadastrar, setContentModalCadastrar] = useState<any>(
    <Form form={form} name="control-hooks">
      <Space direction='vertical'>
        <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="raca" label="Raça" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="peso" label="Peso" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="data_nascimento" label="Data de nascimento" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
      </Space>
    </Form>
  );
  const [contentModalAtualizar, setContentModalAtualizar] = useState<any>();
  const [contentModalDeletar, setContentModalDeletar] = useState<any>();

  const handleCloseModalBuscar = () => {
    setIsModalBuscarOpen(false);
  }

  const handleCloseModalCadastrar = () => {
    setIsModalCadastrarOpen(false);
  }

  const handleCloseModalAtualizar = () => {
    setIsModalAtualizarOpen(false);
  }

  const handleCloseModalDeletar = () => {
    setIsModalDeletarOpen(false);
  }

  const buscarGatinhos = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        key: 'nome',
      },
      {
        title: 'Raça',
        dataIndex: 'raca',
        key: 'raca',
      },
      {
        title: 'Peso',
        dataIndex: 'peso',
        key: 'peso',
      },
      {
        title: 'Data de Nascimento',
        dataIndex: 'data_nascimento',
        key: 'data_nascimento',
      },
      {
        title: 'Deletar',
        key: 'deletar',
        render: (_: any, record: any) => (
          <Space size="middle">
            <Button onClick={() => deletarGatinhos(record.id)}>
              <DeleteOutlined />
            </Button>
          </Space>
        ),
      },
    ];

    setIsModalBuscarOpen(true);

    setContentModalBuscar(
      <>
        <Table columns={columns} dataSource={data}  />
      </>
    );
  }

  const cadastrarGatinhos = async () => {
    const nome = form.getFieldValue('nome');
    const raca = form.getFieldValue('raca');
    const peso = form.getFieldValue('peso');
    const data_nascimento = form.getFieldValue('data_nascimento').format('YYYY-MM-DD');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome,
        raca: raca,
        peso: peso,
        data_nascimento: data_nascimento
      })
    });

    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      message.success('Gatinho cadastrado com sucesso!');
    } else {
      message.error('Erro ao cadastrar gatinho!');
    }

  }

  const atualizarGatinhos = () => {
    console.log('atualizar gatinhos')
  }

  const deletarGatinhos = async (id: number) => {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    });

    if (response.status === 200) {
      message.success('Gatinho deletado com sucesso!');
    } else {
      message.error('Erro ao deletar gatinho :(');
    }

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>CRUD Gatinhos</title>
        <meta name="description" content="Crud Gatinhos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Title level={1}>CRUD Gatinhos</Title>
        <Space direction='vertical' size={5}>
          <Button type="primary" onClick={buscarGatinhos}>
            Buscar gatinhos
          </Button>

          <Button type="primary" onClick={() => setIsModalCadastrarOpen(true)}>
            Cadastrar gatinhos
          </Button>

          <Button type="primary" onClick={atualizarGatinhos}>
            Atualizar gatinhos
          </Button>
        </Space>

        <Modal
          title="Buscar gatinhos"
          open={isModalBuscarOpen}
          onCancel={handleCloseModalBuscar}
          width={800}
          footer={[
            <Button key="fechar" type="primary" onClick={handleCloseModalBuscar}>
              Fechar
            </Button>
          ]}
        >
          {contentModalBuscar}
        </Modal>

        <Modal
          title="Cadastrar gatinhos"
          open={isModalCadastrarOpen}
          onCancel={handleCloseModalCadastrar}
          footer={[
            <Button htmlType="button" onClick={onReset}>
              Corrigir
            </Button>,
            <Button key="fechar" danger onClick={handleCloseModalCadastrar}>
              Cancelar
            </Button>,
            <Button type="primary" htmlType="submit" onClick={cadastrarGatinhos}>
              Enviar
            </Button>
          ]}
        >
          {contentModalCadastrar}
        </Modal>




      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
