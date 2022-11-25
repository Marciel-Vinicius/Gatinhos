import Head from 'next/head'
import Image from 'next/image'
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
import { FormInstance } from 'rc-field-form';

const { Title } = Typography;

type Data = {
  id: string,
  nome: string,
  raca: string,
  peso: string,
  data_nascimento: string
}

export default function Home() {
  const apiUrl = 'http://localhost:3000/api/gatos';

  const [formCadastrar] = Form.useForm();
  const [formEditar] = Form.useForm();


  const [isModalCadastrarOpen, setIsModalCadastrarOpen] = useState<boolean>(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState<boolean>(false);
  const [loadingDadosCadastrar, setLoadingDadosCadastrar] = useState<boolean>(true);
  const [confirmLoadingEditar, setConfirmLoadingEditar] = useState<boolean>(false);
  const [dadosBuscarGatos, setDadosBuscarGatos] = useState<any>();
  const [dadosEditarGatos, setDadosEditarGatos] = useState<any>();

  const resetForm = (form: FormInstance) => {
    form.resetFields();
  };

  const buscarGatoPorId = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      const data = await response.json();
  
      await setDadosEditarGatos(data);

      return "buscarGatoPorId: Sucesso!"
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

  useEffect(() => {
    buscarGatos().then(() => {
      setLoadingDadosCadastrar(false);
    });
  }, [])

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


  const deletarGatos = async (id: number) => {
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
      message.success('Gato deletado com sucesso!');
      buscarGatos();
    } else {
      message.error('Erro ao deletar gato :(');
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
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>

          <Button
            onClick={() => {
              buscarGatoPorId(record.id)
              .then((result) => {
                console.log(`RESULT: ${result}`)
                console.log(dadosEditarGatos);
                setIsModalEditarOpen(true);
                setConfirmLoadingEditar(true);
              }).catch((error) => {
                console.error(error);
              });
            }}
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
        <meta name="description" content="Crud Gatos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Title level={1}>CRUD</Title>
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
            <Button htmlType="button" onClick={() => resetForm(formCadastrar)}>
              Corrigir
            </Button>,
            <Button key="fechar" danger onClick={() => setIsModalCadastrarOpen(false)}>
              Cancelar
            </Button>,
            <Button type="primary" htmlType="submit" onClick={cadastrarGatos}>
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

        <Modal
          title="Editar gato"
          open={isModalEditarOpen}
          onCancel={() => setIsModalEditarOpen(false)}
          footer={[
            <Button htmlType="button" onClick={() => resetForm(formEditar)}>
              Corrigir
            </Button>,
            <Button key="fechar" danger onClick={() => setIsModalEditarOpen(false)}>
              Cancelar
            </Button>,
            <Button type="primary" htmlType="submit" onClick={editarGato}>
              Enviar
            </Button>
          ]}

        >
          <Form form={formEditar} name="control-hooks-editar">
            <Space direction='vertical'>
              <Form.Item
                name="id"
                label="Id"
                initialValue={dadosEditarGatos?.id}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="nome"
                label="Nome"
                initialValue={dadosEditarGatos?.nome}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="raca"
                label="Raça"
                initialValue={dadosEditarGatos?.raca}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="peso"
                label="Peso"
                initialValue={dadosEditarGatos?.peso}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="data_nascimento"
                label="Data de nascimento"
                initialValue={dayjs(dadosEditarGatos ? new Date(dadosEditarGatos.data_nascimento) : new Date())}
              >
                <DatePicker />
              </Form.Item>
            </Space>
          </Form>
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
