// meshsdk expects global and Buffer to be available
window.global ||= window;

import {Buffer} from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

