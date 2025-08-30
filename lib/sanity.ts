// import { createClient } from 'next-sanity';
import {createClient} from '@sanity/client';

export const sanity = createClient({
  projectId: 'vf0zj4s9',
  dataset: 'production',
  apiVersion: '2025-08-29',
  useCdn: true,
});