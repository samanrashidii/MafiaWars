<template>
  <div
    class="dashboard"
  >
    <!-- Dashboard Header & Back to Settings button -->
    <div
      class="dashboard-header"
    >
      <PageBox>
        <PageTitle
          dashboard-title
        />
      </PageBox>
      <BaseButton
        v-if="gameSettings.stepCounter !== 3"
        class="settings-bttn danger has-small-top-margin"
        @clicked="toggleAlertBox(true)"
      >
        <span>
          {{ $t('pages.home.changeSettings') }}
        </span>
      </BaseButton>
    </div>
    <!-- Confirmation Alert for change settings -->
    <Overlay
      :class="{
        'active': alertBox,
        'dialog': true
      }"
    >
      <img
        class="has-xsmall-bottom-margin"
        src="@/assets/images/icons/warning.svg"
        :alt="$t('general.warningIcon')"
      >
      <p>
        {{ $t('pages.home.changeSettingsText') }}
      </p>
      <BaseButton
        class="green"
        @clicked="changeGameSettings()"
      >
        <span>
          {{ $t('pages.home.confirmButton') }}
        </span>
      </BaseButton>
      <BaseButton
        class="danger"
        @clicked="toggleAlertBox(false)"
      >
        <span>
          {{ $t('pages.home.cancelButton') }}
        </span>
      </BaseButton>
    </Overlay>
    <transition
      name="slide"
      mode="out-in"
    >
      <!-- Input to write name of players -->
      <PageBox
        v-if="gameSettings.stepCounter === 1"
        class="has-top-padding"
        key="step1"
      >
        <!-- Load last game players -->
        <a
          v-if="checkUsers"
          href="javascript:void(0)"
          class="predefined type-2"
          :class="{
            'active': showSavedNames
          }"
          @click="toggleSavedNames()"
        >
          <span>
            {{ $t('pages.home.lastNames') }}
          </span>
        </a>
        <!-- Use Pre Defined names for players -->
        <a
          v-else
          href="javascript:void(0)"
          class="predefined"
          :class="{
            'active': showPredefined
          }"
          @click="togglePredefinedNames()"
        >
          <span>
            {{ $t('pages.home.defaultNames') }}
          </span>
        </a>
        <p>
          {{ $t('pages.home.chooseNameHint') }}
        </p>
        <p
          class="important-hint"
        >
          {{ $t('pages.home.nameExtraHint') }}
        </p>
        <input
          v-for="(roleInput, index) in gameSettings.selectedRoles"
          @keyup.enter="$event.target.nextElementSibling.focus()"
          type="text"
          class="has-xsmall-bottom-margin"
          :key="index"
          v-model="players[index]"
        >
        <BaseButton
          class="primary assign-bttn"
          @clicked="assignRoles()"
        >
          <span>
            {{ $t('pages.home.assign') }}
          </span>
        </BaseButton>
      </PageBox>
      <!-- Show each player their randomly chosen character -->
      <PageBox
        v-else-if="gameSettings.stepCounter === 2"
        class="display autoheight"
        key="step2"
      >
      <RoleCard :players="players" />
      </PageBox>
      <!-- Show God Panel When each player knows his role -->
      <GodPanel
        v-else-if="gameSettings.stepCounter === 3"
        key="step3"
      />
    </transition>
  </div>
</template>

<script>
import GodPanel from '@/components/GodPanel.vue';
import ShowBox from '@/components/ShowBox.vue';
import PageTitle from '@/components/PageTitle.vue';
import RoleCard from '@/components/RoleCard.vue';

export default {
  data() {
    return {
      players: [],
      showPredefined: false,
      showSavedNames: false,
      alertBox: false
    }
  },
  components: {
    GodPanel,
    ShowBox,
    PageTitle,
    RoleCard,
  },
  computed: {
    roles() {
      return JSON.parse(JSON.stringify(this.Roles))
    },
    checkUsers() {
      const savedPlayers = JSON.parse(localStorage.getItem('latest-players'))
      if (savedPlayers && savedPlayers.length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
     assignRoles () {
      this.gameSettings.stepCounter = 2;
      this.SetGameSettings(this.gameSettings)
     },
    togglePredefinedNames () {
      if (this.showPredefined === false) {
        this.fillPreDefinedNames()
        this.showPredefined = true
        this.showSavedNames = false
      } else {
        this.players = []
        this.showPredefined = false
        this.showSavedNames = true
      }
    },
    toggleSavedNames () {
      if (this.showSavedNames === false) {
        this.players = JSON.parse(localStorage.getItem('latest-players'))
        if (this.gameSettings.selectedRoles.length < this.players.length) {
          this.players = this.players.slice(0, this.gameSettings.selectedRoles.length)
        }
        this.showPredefined = false
        this.showSavedNames = true
      } else {
        this.players = []
        this.showPredefined = true
        this.showSavedNames = false
      }
    },
    fillPreDefinedNames () {
      this.gameSettings.selectedRoles.forEach((name, index) => {
        this.players.push(`${this.$t('pages.home.playerDefault')} ${index + 1}`)
      })
    },
    toggleAlertBox (value) {
      this.alertBox = value
    },
    randomFunc () {
      this.gameSettings.selectedRoles.sort(() => 0.5 - Math.random())
    },
    changeGameSettings () {
      this.startGameEngine('roles-selected-create')
    }
  }
}
</script>
