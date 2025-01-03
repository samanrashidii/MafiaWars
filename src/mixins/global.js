import { mapGetters, mapActions } from 'vuex'
import actionLog from '@/mixins/actionLog';
import actions from '@/mixins/actions';
import actionSelectTarget from '@/mixins/actionSelectTarget';
import changePhase from '@/mixins/changePhase';
import executeAction from '@/mixins/executeAction';
import godAction from '@/mixins/godAction';
import navigateActions from '@/mixins/navigateActions';
import passiveActive from '@/mixins/passiveActive';
import possibilities from '@/mixins/possibilities';
import saveHistory from '@/mixins/saveHistory';
import setActions from '@/mixins/setActions';
import voteKiller from '@/mixins/voteKiller';

export default {
  mixins: [
    actionLog,
    actions,
    actionSelectTarget,
    changePhase,
    executeAction,
    godAction,
    navigateActions,
    passiveActive,
    possibilities,
    saveHistory,
    setActions,
    voteKiller
  ],
  computed: {
    ...mapGetters({
      allStates: 'allStates',
      GameSettings: 'gameSettings/gameSettings',
      Dashboard: 'dashboard/dashboard',
      Roles: 'roles/Roles',
      ReplacingRoles: 'roles/ReplacingRoles'
    }),
    gameSettings () {
      return JSON.parse(JSON.stringify(this.GameSettings))
    },
    dashboard () {
      return JSON.parse(JSON.stringify(this.Dashboard))
    },
    replacingRoles () {
      return JSON.parse(JSON.stringify(this.ReplacingRoles))
    },
    checkRoute () {
      return this.$route.name
    },
    currentLang () {
      const output = this.$root._i18n.locale
      return output
    }
  },
  methods: {
    ...mapActions({
      SetGameSettings: 'gameSettings/SetGameSettings',
      SetGameSettingsItem: 'gameSettings/SetGameSettingsItem',
      SetRoles: 'roles/SetRoles',
      SetReplacingRoles: 'roles/SetReplacingRoles',
      SetDashboard: 'dashboard/SetDashboard',
      SetDiscordChannel: 'gameSettings/SetDiscordChannel',
      PostToDiscord: 'gameSettings/PostToDiscord'
    }),
    dice (number) {
      return Math.floor(Math.random() * number) + 1
    },
    getImg (dir, pic) {
      return require(`@/assets/images${dir}/${pic}`)
    },
    checkStatus (target, statuses = {}) {
      let output = true
      this.gameSettings.selectedRoles.forEach((role) => {
        if (role.player === target) {
          for (const [key, value] of Object.entries(statuses)) {
            if (role.status[key] !== value) {
              output = false
            }
          }
        }
      })
      return output
    },
    getStatus (target, statuses = {}) {
      const output = {}
      this.gameSettings.selectedRoles.forEach((role) => {
        if (role.player === target) {
          for (const [key, value] of Object.entries(statuses)) {
            output[key] = value
          }
        }
      })
      return output
    },
    setStatus (target, statuses = {}) {
      this.gameSettings.selectedRoles.forEach((role) => {
        if (role.player === target) {
          for (const [key, value] of Object.entries(statuses)) {
            role.status[key] = value
          }
        }
      })
    },
    setActionInUseStatus (target, statuses = {}) {
      this.dashboard.actionBox.forEach((role) => {
        if (role.player === target) {
          for (const [key, value] of Object.entries(statuses)) {
            role.status[key] = value
          }
        }
      })
    },
    getSiblingTargets (target) {
      // Get Index of main target and siblings
      const mainTargetIndex = this.gameSettings.selectedRoles.findIndex(role => role.player === target)
      // Check if index is 0 set it to length of array - 1
      const prevIndex = mainTargetIndex === 0 ? this.gameSettings.selectedRoles.length - 1 : mainTargetIndex - 1
      // Check if index is equal to array's length set it to 0
      const nextIndex = mainTargetIndex === this.gameSettings.selectedRoles.length ? 0 : mainTargetIndex + 1
      // Get Index of main target and siblings
      const mainTarget = this.getRoleObjectByIndex(mainTargetIndex)
      const prevTarget = this.getRoleObjectByIndex(prevIndex)
      const nextTarget = this.getRoleObjectByIndex(nextIndex)
      const output = {
        mainTarget,
        prevTarget,
        nextTarget
      }
      return output
    },
    getRoleObjectByName (target) {
      return this.gameSettings.selectedRoles.filter(role => role.player === target)[0]
    },
    getRoleObjectByIndex (roleIndex) {
      return this.gameSettings.selectedRoles.filter((role, index) => index === roleIndex)[0]
    },
    getRoleObjectById (id) {
      return this.gameSettings.selectedRoles.filter(role => role.id === id)[0]
    },
    getRoleObjectByNameInAction (target) {
      return this.dashboard.actionBox.filter(role => role.player === target)[0]
    },
    startGameEngine (type) {
      if (type) {
        let state = {}
        const discordToken = localStorage.getItem('discordToken')

        if (type === 'roles-selected-create') {
          state = JSON.parse(localStorage.getItem('save-roles-selected-create'))
        } else if (type === 'roles-selected-dashboard') {
          state = JSON.parse(localStorage.getItem('save-roles-selected-dashboard'))
        } else if (type === 'autosave') {
          state = JSON.parse(localStorage.getItem('save-automatic'))
        }

        this.SetRoles(state.roles.Roles)
        this.SetReplacingRoles(state.roles.ReplacingRoles)
        this.SetGameSettings(state.gameSettings.gameSettings)
        this.SetDashboard(state.dashboard.dashboard)

        if (discordToken) {
          this.SetDiscordChannel(discordToken)
        }
      }
    },
    postDiscord (text, staticUrl) {
      const discordPayload = {
        payload: {
          embeds: [{
            description: text,
            color: 1160836
          }],
          tts: false
        },
        url: staticUrl || this.gameSettings.discordChannel
      }
      if (this.gameSettings.discordChannel || staticUrl) {
        this.PostToDiscord(discordPayload)
      }
    },
    shuffle (array) {
      const output = array.sort(() => Math.random() - 0.5)
      return output
    },
  }
}
