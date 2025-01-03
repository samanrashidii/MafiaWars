import Vue from 'vue'
import SERVER from '@/service/server'

export default {
  namespaced: true,
  state: {
    gameSettings: {
      totalPlayers: 6,
      mafia: 1,
      citizen: 5,
      alivePeople: 0,
      deadPeople: 0,
      aliveMafia: 0,
      deadMafia: 0,
      aliveCitizens: 0,
      deadCitizens: 0,
      aliveSolo: 0,
      selectedMafia: 0,
      selectedCitizen: 0,
      selectedRoles: [],
      multipleRoles: {
        normalMafia: 0,
        normalCitizen: 0
      },
      fMafias: [],
      fCitizens: [],
      powerControl: {
        power: 0,
        mafiaPower: 0,
        citizenPower: 0
      },
      gameStarted: false,
      gameReset: false,
      gameFinished: false,
      hasSavedGame: false,
      winner: null,
      soloWins: false,
      soloWinnner: null, //winner
      safemode: false,
      reviewGame: false,
      stepCounter: 1,
      roleViewer: false,
      searchingUsed: false,
      viewerItems: [],
      discordChannel: null
    }
  },
  getters: {
    gameSettings: state => state.gameSettings
  },
  mutations: {
    SET_GAME_SETTINGS: (state, settings) => {
      Vue.set(state, 'gameSettings', settings)
      // Start Game Rules
      state.gameSettings.fMafias = state.gameSettings.selectedRoles.filter(role => role.mafia)
      state.gameSettings.fCitizens = state.gameSettings.selectedRoles.filter(role => !role.mafia)
      state.gameSettings.alivePeople = state.gameSettings.selectedRoles.filter(role => !role.status.dead).length
      state.gameSettings.deadPeople = state.gameSettings.selectedRoles.filter(role => role.status.dead).length
      state.gameSettings.aliveMafia = state.gameSettings.selectedRoles.filter(role => !role.status.dead && role.mafia).length
      state.gameSettings.aliveCitizens = state.gameSettings.selectedRoles.filter(role => !role.status.dead && !role.mafia).length
      state.gameSettings.aliveSolo = state.gameSettings.selectedRoles.filter(role => !role.status.dead && !role.mafia && role.solo).length
      state.gameSettings.deadMafia = state.gameSettings.selectedRoles.filter(role => role.status.dead && role.mafia).length
      state.gameSettings.deadCitizens = state.gameSettings.selectedRoles.filter(role => role.status.dead && !role.mafia).length
      // End Game Rules
      const hasFinishStopper = state.gameSettings.selectedRoles.filter(role => role.solo && role.status.finishStopper && !role.status.dead)
      const mafiaOdds = state.gameSettings.selectedRoles.filter(role => !role.status.dead && role.mafia && !role.status.traitor).length
      const soloOdds = hasFinishStopper.length > 0
      const finishGame = (winner) => {
        state.gameSettings.gameFinished = true
        state.gameSettings.winner = winner
      }
      if (state.gameSettings.alivePeople <= 2 && state.gameSettings.gameStarted && soloOdds) {
        state.gameSettings.soloWinner = hasFinishStopper[0]
        state.gameSettings.soloWins = true
      }
      if (state.gameSettings.soloWins && !state.gameSettings.reviewGame) {
        finishGame('solo')
      } else if (state.gameSettings.alivePeople / 2 <= mafiaOdds && hasFinishStopper.length === 0 && state.gameSettings.gameStarted && !state.gameSettings.reviewGame) {
        finishGame('mafia')
      } else if (mafiaOdds === 0 && hasFinishStopper.length === 0 && state.gameSettings.gameStarted && !state.gameSettings.reviewGame) {
        finishGame('citizen')
      }
    },
    SET_GAME_SETTINGS_ITEM: (state, items = {}) => {
      for (const [key, value] of Object.entries(items)) {
        Vue.set(state.gameSettings, key, value)
      }
    },
    SET_DISCORD_CHANNEL: (state, data) => {
      state.gameSettings.discordChannel = data
      if (data) {
        localStorage.setItem('discordToken', data)
      } else {
        localStorage.removeItem('discordToken')
      }
    }
  },
  actions: {
    SetGameSettings: (context, settings) => {
      context.commit('SET_GAME_SETTINGS', settings)
    },
    SetGameSettingsItem: (context, settings) => {
      context.commit('SET_GAME_SETTINGS_ITEM', settings)
    },
    SetDiscordChannel: (context, data) => {
      context.commit('SET_DISCORD_CHANNEL', data)
    },
    PostToDiscord: (context, data) => SERVER.postToDiscord(data.payload, data.url)
  }
}
