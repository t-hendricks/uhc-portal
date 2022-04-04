#!/usr/bin/env node

import { getFlatUrls } from '../src/common/installLinks.mjs';

const flatUrls = await getFlatUrls();
flatUrls.forEach(url => console.log(url));
