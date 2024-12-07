<template>
        <div class="main-container">
            <div class="name-container">
                <div 
                    class="player-names" 
                    v-for="(player, index) in players" 
                    v-bind:key="player"   
                >
                <Strong 
                    v-if="(index + 1) === personNumber"
                >
                    {{ player }}
                </Strong>
                </div>
            </div>
        <div class="role-invisble" v-if="!roleShow">
        <ul class='player-cards'>
            <li
                class="single-player"
                :class="{'mafia':role.mafia && selectedIndex == index  ,
                         'solo': role.solo && selectedIndex == index ,
                         'citizen': roleShow && !role.solo && !role.mafia && selectedIndex == index 
                }"
                @click="selectItem(index, role.id)"
                v-for="(role, index) in localSelectedRoles" 
                :key="role.id"
             >
             <div
                class="text-image"
                :class="{
                'mafia': role.mafia,
                'solo': role.solo,
            }">
                <img
                    v-if="selectedIndex === index"
                    :src="getImg('/roles', role.icon)" alt="roleImage" 
                 >
                    <div
                        v-if="selectedIndex === index"
                    >
                        <strong>{{ role.info[currentLang].name }}</strong>
                    </div>
                <p 
                    v-else
                >
                {{$t('pages.home.showCharacter')}}
                </p>
             </div>
            </li>
        </ul>
        </div>
        <div class="role-invisble" v-else>

        </div>
        <BaseButton 
        class="green" 
        @clicked="nextPerson()"
        v-if="roleShow"
             >
                {{$t('pages.home.passMobile')}}
        </BaseButton> 
        </div>
</template>



<script>
import shuffleMixin from '../mixins/global'
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
        selectItem (index, id) {
            //if the player selects a card and the index is -1 means that no player is selected so the action needs to show the roles 
            if (this.selectedIndex == -1) {
                this.roleShow = true
                this.selectedIndex = index
                //this is the part where you find the role in the local storage and if the role exists in the local storage you would assign it to the player
                const selectedRole = this.gameSettings.selectedRoles.find(role => role.id === id) 
                if(selectedRole) {
                    selectedRole.player = this.players[this.personNumber - 1]
                } 
            }  
        },
    },
}
</script>
