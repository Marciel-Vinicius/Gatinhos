import Head from 'next/head'
import styles from '../styles/Home.module.css'

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Typography,
  Modal,
  Table,
  DatePicker,
  message,
  Skeleton,
  Popconfirm
} from 'antd';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

const { Title } = Typography;

type Data = {
  id: string,
  nome: string,
  raca: string,
  peso: string,
  data_nascimento: string
}

export default function Home() {
  const apiUrl = 'http://localhost:3001/api/gatos';

  const [formCadastrar] = Form.useForm();
  const [formEditar] = Form.useForm();

  const [isModalCadastrarOpen, setIsModalCadastrarOpen] = useState<boolean>(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState<boolean>(false);
  const [loadingDadosCadastrar, setLoadingDadosCadastrar] = useState<boolean>(true);
  const [dadosBuscarGatos, setDadosBuscarGatos] = useState<any>();

  const resetForm = (form: FormInstance) => {
    form.resetFields();
  };

  const setFieldsFormEditar = async (data: Data) => {
    return new Promise((resolve, reject) => {
      formEditar.setFieldsValue({
        id: data.id,
        nome: data.nome,
        raca: data.raca,
        peso: data.peso,
        data_nascimento: dayjs(data.data_nascimento)
      });

      if (formEditar.getFieldsValue()) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  const buscarGatoPorId = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      const data = await response.json();

      return data[0];
    } catch (error) {
      return error;
    }
  }

  const buscarGatos = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      setDadosBuscarGatos(data);

      return "buscarGatos: Sucesso!"
    } catch (error) {
      return error;
    }

  }

  const cadastrarGatos = async () => {
    const nome = formCadastrar.getFieldValue('nome');
    const raca = formCadastrar.getFieldValue('raca');
    const peso = formCadastrar.getFieldValue('peso');
    const data_nascimento = formCadastrar.getFieldValue('data_nascimento').format('YYYY-MM-DD');

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
    if (response.status === 200) {
      message.success('Gato cadastrado com sucesso!');
      resetForm(formCadastrar);
      buscarGatos();
    } else {
      message.error('Erro ao cadastrar gato!');
    }
  }

  const editarGato = async () => {
    const id = formEditar.getFieldValue('id');
    const nome = formEditar.getFieldValue('nome');
    const raca = formEditar.getFieldValue('raca');
    const peso = formEditar.getFieldValue('peso');
    const data_nascimento = formEditar.getFieldValue('data_nascimento').format('YYYY-MM-DD');

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        nome: nome,
        raca: raca,
        peso: peso,
        data_nascimento: data_nascimento
      })
    });

    const data = await response.json();

    if (response.status === 200) {
      message.success('Gato editado com sucesso!');
      resetForm(formEditar);
      buscarGatos();
    } else {
      message.error('Erro ao editar gato!');
    }
  }

  const deletarGatos = async (id: number) => {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      message.success('Gato deletado com sucesso!');
      buscarGatos();
    } else {
      message.error('Erro ao deletar gato :(');
    }
  }

  const handleEditarGato = (id: string) => {
    buscarGatoPorId(id).then((data) => {
      setFieldsFormEditar(data)
        .then(() => {
          setIsModalEditarOpen(true);
        });
    });
  }

  useEffect(() => {
    buscarGatos().then(() => {
      setLoadingDadosCadastrar(false);
    });
  }, []);

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
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            placement="top"
            title={`Tem certeza que deseja deletar o gato ${record.nome}?`}
            onConfirm={() => deletarGatos(record.id)}
            okText="Deletar"
            cancelText="Cancelar"
            icon={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
            okButtonProps={{ danger: true }}
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>

          <Button
            onClick={() => handleEditarGato(record.id)}
          >
            <EditOutlined />
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>CRUD Gatos</title>
        <meta lang='pt-br' name="description" content="Crud Gatos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Typography>
          <Title level={1}>CRUD Gatos</Title>
        </Typography>

        <Space direction='vertical' size={5}>
          <Skeleton loading={loadingDadosCadastrar} active>
            <Table columns={columns} dataSource={dadosBuscarGatos} />
          </Skeleton>

          <Button type="primary" onClick={() => setIsModalCadastrarOpen(true)}>
            Cadastrar gatos
          </Button>
        </Space>

        <Modal
          title="Cadastrar gatos"
          open={isModalCadastrarOpen}
          onCancel={() => setIsModalCadastrarOpen(false)}
          footer={[
            <Button htmlType="button" key="cadastrar-corrigir" onClick={() => resetForm(formCadastrar)}>
              Corrigir
            </Button>,
            <Button key="cadastrar-fechar" danger onClick={() => setIsModalCadastrarOpen(false)}>
              Cancelar
            </Button>,
            <Button type="primary" key="cadastrar-enviar" htmlType="submit" onClick={cadastrarGatos}>
              Enviar
            </Button>
          ]}
        >
          <Form form={formCadastrar} name="control-hooks-cadastrar">
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
        </Modal>

        <Form
          form={formEditar}
          name="control-hooks-editar"
        >
          <Modal
            title="Editar gato"
            open={isModalEditarOpen}
            onCancel={() => setIsModalEditarOpen(false)}
            footer={[
              <Button htmlType="button" key="editar-corrigir" onClick={() => resetForm(formEditar)}>
                Corrigir
              </Button>,
              <Button key="editar-fechar" danger onClick={() => setIsModalEditarOpen(false)}>
                Cancelar
              </Button>,
              <Button type="primary" key="editar-enviar" htmlType="submit" onClick={editarGato}>
                Enviar
              </Button>
            ]}

          >
            <Space direction='vertical'>
              <Form.Item
                name="id"
                label="Id"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="nome"
                label="Nome"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="raca"
                label="Raça"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="peso"
                label="Peso"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="data_nascimento"
                label="Data de nascimento"
              >
                <DatePicker />
              </Form.Item>
            </Space>
          </Modal>
        </Form>
      </main>

      <footer className={styles.footer}>
        <p>
          Desenvolvido por: Marciel V. de Lara e Patrick C. Paludo
        </p>
      </footer>
    </div>
  )
}
