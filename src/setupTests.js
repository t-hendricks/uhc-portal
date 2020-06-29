import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on('unhandledRejection', () => {});
  process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
}

configure({ adapter: new Adapter() });
