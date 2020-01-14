const MODE = 'devlopment';
const VERSION = 'V0.0.1';
const DEVELOPMENT_PREFIX = 'http://localhost:3000/api';
const PREFIX =  ( MODE === 'production' ) ? PRODUCTION_PREFIX : DEVELOPMENT_PREFIX;

export default {
  MODE: MODE,
  version: VERSION,
  login: `${PREFIX}/login`,
  todo: `${PREFIX}/todo`,
  okr: `${PREFIX}/okr`,
  keyresult: `${PREFIX}/keyresult`,
  objective: `${PREFIX}/objective`,
  todo_keyresult: `${PREFIX}/todo_keyresult`
}