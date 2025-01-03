<template>
<div class="main-container">
        <div class="name-container">
                <div 
                    class="player-names" 
                    
                    v-for="(player, index) in players" 
                    v-bind:key="player"   
                >
                <Strong 
                :class="roleShow ? {
                'mafia-color': userSelectedRole.mafia,
                'solo-color': !userSelectedRole.mafia && userSelectedRole.solo,
                'citizen-color': !userSelectedRole.mafia && !userSelectedRole.solo}
                : ''"
                    v-if="(index + 1) === personNumber"
                >
                    {{ player }}
                </Strong>
                </div>
        </div>
    <div class="player-display">
        <div class="role-invisble" v-if="!roleShow">
        <ul class='player-cards' >
            <li 
                class="single-player"
                @click="selectItem(index, role)"
                v-for="(role, index) in localSelectedRoles" 
                :key="role.id"
             >
             {{ $t('pages.home.roleCard') }} {{ personNumber + index}}
            </li>
        </ul>
    </div>
        <div class="role-visible" v-if="roleShow">
            <p>
      {{ $t('pages.home.gotMobile') }}
        </p>
            <div
                class="role-info"
                :class="{
                    'solo': !userSelectedRole.mafia && userSelectedRole.solo,
                    'citizen': !userSelectedRole.mafia && !userSelectedRole.solo
                }"
                >
                <img
                    :src="getImg('/roles', userSelectedRole.icon)"
                    :alt="userSelectedRole.info[currentLang].name"
                >
                <h4>
                    {{ userSelectedRole.info[currentLang].name }}
                </h4>
            </div>
                    <BaseButton
                    class="awesome"
                    @clicked="nextPerson()"
                    >
                    {{ $t('pages.home.afterShowButton') }}
            </BaseButton>
      
        </div>
    </div>
</div>
       
</template>



<script>
import shuffleMixin from '../mixins/global';
export default {
    mixins: [shuffleMixin],
    name: 'PlayerCard',
    props: {
    players: {
      type: Array,
      default: () => []
    },
  },
    data () {
        return {
        personNumber: 1,
        roleShow: false,
        selectedIndex: -1,
        localSelectedRoles: [],
        userSelectedRole: null
        }
    },
   
    mounted() {
        this.localSelectedRoles = this.shuffle([...this.gameSettings.selectedRoles])

    },
    methods: {
        //when someone clicks on the next button it will move to the next person and if the player who clicks on the button is the last it will move to the next step
        nextPerson() {
            if(this.personNumber == this.gameSettings.selectedRoles.length) {
                this.gameSettings.stepCounter = 3
                this.SetGameSettings(this.gameSettings)  
            }else {
                this.personNumber++   
                this.localSelectedRoles.splice(this.selectedIndex, 1)  
            }
            this.roleShow = false
            this.selectedIndex = -1
        },
        selectItem (index, clickedRole) {
            //if the player selects a card and the index is -1 means that no player is selected so the action needs to show the roles 
            if (this.selectedIndex == -1) {
                this.roleShow = true
                this.selectedIndex = index
                this.userSelectedRole = clickedRole
                //this is the part where you find the role in the local storage and if the role exists in the local storage you would assign it to the player
                const selectedRole = this.gameSettings.selectedRoles.find(role => role.id === clickedRole.id) 
                if(selectedRole) {
                    selectedRole.player = this.players[this.personNumber - 1]
                } 
            }  
        },
        resetShowRole() {
            this.roleShow = false
        }
    },
}
</script>
