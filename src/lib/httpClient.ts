import axios, { AxiosRequestConfig } from 'axios';
import { siteConfig } from '../../config/site.config';

const instance = axios.create({ timeout: siteConfig.httpClientTimeout });

export const get = (url: string, config?: AxiosRequestConfig<any> | undefined) =>
  instance.get(url, config);
