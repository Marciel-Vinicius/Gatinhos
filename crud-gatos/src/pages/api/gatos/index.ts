// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { select, insert, update, remove } from '../../../services/banco';

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  id: string,
  nome: string,
  raca: string,
  peso: string,
  data_nascimento: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    // Process a POST request
    insert(req.body.nome, req.body.raca, req.body.peso, req.body.data_nascimento)
    .then((result: any) => {
      res.status(200).json(result);
      }).catch((err: any) => {
        res.status(500).json(err);
      });
  } else if (req.method === 'GET') {
    // Process a GET request
    select()
    .then((result: any) => {
      res.status(200).json(result);
    }).catch((err: any) => {
      res.status(500).json(err);
    });
  } else if (req.method === 'PUT') {
    // Process a PUT request
    update(req.body.id, req.body.nome, req.body.raca, req.body.peso, req.body.data_nascimento)
    .then((result: any) => {
      res.status(200).json(result);
    }).catch((err: any) => {
      res.status(500).json(err);
    });
  } else if (req.method === 'DELETE') {
    // Process a DELETE request
    remove(req.body.id)
    .then((result: any) => {
      res.status(200).json(result);
    }).catch((err: any) => {
      res.status(500).json(err);
    });
  } else {
    return false;
  }

  
}
