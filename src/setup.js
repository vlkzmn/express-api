import 'dotenv/config';
import { sequelize } from './gb.js';

import './models/Room.js';
import './models/Message.js';

sequelize.sync({ force: true });
