import { reactive } from 'vue'

/**
 * @typedef {Object} Printer
 * @property {string} name
 * @property {string} location
 * @property {string} description
 * @property {string} model
 * @property {string} driver
 * @property {string} status
 * @property {string} info
 */

/**
 * @typedef {Object} Spool
 * @property {number} id
 * @property {string} user
 * @property {string} print
 * @property {string} [title]
 * @property {number} [copies]
 * @property {number} [printed]
 * @property {string} [range]
 * @property {"all" | "odd" | "even"} [pages]
 * @property {"one-sided" | "two-sided-long-edge" | "two-sided-short-edge"} [sided]
 * @property {"letter" | "A3" | "A4" | "A5" | "legal" | "envelope" | "photo"} [media]
 * @property {"3" | "4" | "5" | "6" | "N" | undefined} [orientation]
 * @property {"3" | "4" | "5"} [quality]
 * @property {Buffer | File} [buffer]
 * @property {string} [path]
 * @property {"send" | "printing" | "printed" | "cancel"} [status]
 * @property {string[]} msgs
 * @property {string[]} errors
 */

/**
 * @typedef {Object} PageLog
 * @property {string} print
 * @property {string} user
 * @property {string} job
 * @property {string} time
 * @property {string} pages
 * @property {string} copies
 * @property {string} jobBilling
 * @property {string} jobOriginatingHostName
 * @property {string} jobName
 * @property {string} media
 * @property {string} sides
 */

/**
 * @typedef {Object} App
 * @property {Spool[]} spools
 * @property {Printer[]} printers
 * @property {Object} system
 * @property {boolean} system.rebooting
 * @property {boolean} system.saving
 * @property {string} system.token
 * @property {string} system.port
 * @property {Object} auth
 * @property {boolean} auth.enable
 * @property {Object} auth.ad
 * @property {string} auth.ad.url
 * @property {string} auth.ad.baseDN
 * @property {string} auth.ad.username
 * @property {string} auth.ad.password
 */

export const app = reactive(
  /** @type {App} */ ({
    spools: [],
    printers: [],
    system: {
      rebooting: false,
      saving: false,
      token: '',
      port: '3000',
    },
    auth: {
      enable: true,
      ad: {
        url: 'ldap://10.11.0.16',
        baseDN: 'dc=ifg,dc=br',
        username: '1934155',
        password: '',
      },
    },
  })
)
