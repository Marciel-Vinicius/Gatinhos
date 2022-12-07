// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { selectById } from '../../../services/banco';

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
  const { id } = req.query;
  if (req.method === 'GET') {
    // Process a GET request
    selectById(String(id))
    .then((result: any) => {
      res.status(200).json(result);
    }).catch((err: any) => {
      res.status(500).json(err);
    });
  } else {
    return false;
  }

  
}
