$(document).ready(function() {

    class character {
        constructor(id, hp) {
            this.id = id;
            this.hp = hp;
            this.ap = this.generateAP();
            this.type;
            this.div_html = `
                <div class='col-lg-3 mx-lg-0 px-lg-0 px-lg-0 display chars' id=${this.id}>
                    <div class='out_name'>Name</div>
                    <img src='assets/images/${this.id.toLowerCase()}.jpg' class='img-fluid' />
                    <div class='out_hp'>HP</div>
                </div>
            `;
            /*Note: I chose to not add a counter attack variable -
            the game logic still functions like the requirments.*/
        }
    
        generateAP() {
            let randomNum = 0;
            if(this.type === 'player') {
                randomNum = (Math.floor(Math.random() * (5 - 2) + 2));
            } else if(this.type === 'enemy') {
                // randomNum = Math.floor((Math.random() * 60) + 30);
                randomNum = (Math.floor(Math.random() * (30 - 20) + 20));
            }
            this.ap = parseInt(randomNum);
        }

        incrementAP() {
            if(this.type === 'player') {
                this.ap *= 2;
            }
        }
    }

    console.log('js online');

    let characters = [];
    let select_char = false;
    let select_enemy = false;

    let player = null;
    let the_playing_enemy = null;

    const $div_select_enemy = $('.div_select_enemy');
    const $div_playing_enemy = $('.div_playing_enemy');

    //Before start game:
    $('#btn_restart').hide();
    $('.container').hide();

    //Start game:
    $('#btn_startGame').on('click', function(){
        $(this).parent().hide();
        $('.container').show();
        let names = ['Frodo', 'Aragorn', 'Sauron', 'Gandalf'];
        let hps = [100, 120, 150, 140];
  
        for(let i = 0; i < 4; i++) {
            let char = new character(names[i], hps[i]);
            characters.push(char);
            $('.div_select_char').append(characters[i].div_html);
        }
        // console.log(characters);

        //Display HP
        refreshHP();
    });

    // Select Character
    $(document).on('click', '.chars', function() {

    let $that = $(this);
    // console.log($that.attr('class'));

        if(!select_char) {

            $('#h2_character').text('Your Character:');

            //Set player
            for(let i = 0; i < characters.length; i++) {
                if(characters[i].id === $(this).attr('id')) {
                    characters[i].type = 'player';
                    player = characters[i];
                } else {
                    characters[i].type = 'enemy';
                }
                characters[i].generateAP();
            }
            
            // console.log(characters.find(char => char.type === 'player'));

            $('.chars').each(function(i, val) {
                // console.log('that : ' + $that.attr('id') + '\nthis : ' + $(this).attr('id'));

                if($(this).attr('id').toLowerCase() !== $that.attr('id').toLowerCase()){
                    $(this).removeClass('chars').addClass('selectable_enemies');
                }
                select_char = true;
            });
        }
        refresh();
    });

    // Select Enemy
    $(document).on('click', ".selectable_enemies", function() {
        $that = $(this);
        if(!select_enemy) {
            // alert($(this).attr('class'));
            $('#out_fightStatus').text('');
            $that.removeClass('selectable_enemies').addClass('playing_enemy');
            select_enemy = true;
            // console.log('selectable ');
            for(let i = 0; i < characters.length; i++) {
                if(characters[i].id === $that.attr('id')) {
                    // console.log('characters length =  ' + characters.length);
                    // console.log('this: ' + $that);
                    characters[i].type = 'enemy';
                    the_playing_enemy = characters[i];
                    // console.log('the_playing_enemy =  ' + the_playing_enemy.id);
                }
            }
        }
        bottom.scrollIntoView(false);
        refresh2();      
    });

    const bottom = document.getElementById('bottom');

    //Fight Button Clicked:
    $('#btn_fight').on('click', function() {
        window.scrollTo(0, document.body.scrollHeight);

        // window.scrollBy(0, 300);
        refreshHP();
        if(select_enemy) {
            fight();
        } else if(!select_char) {
            $('#out_fightStatus').text('Select your character!');
        } else if(!select_enemy) {
            $('#out_fightStatus').text('Select an enemy to attack!');
        }
    });

    //Fight Function logic:
    const fight = () => {
        // console.log('the_playing_enemy.ap =  ' + the_playing_enemy.ap);
        // console.log('player ap = ' + player.ap);
        // console.log('player hp = ' + player.hp);
        // console.log('the_playing_enemy = ' + the_playing_enemy.hp);

        the_playing_enemy.hp -= player.ap;
        $('#out_fightStatus').text(`${player.id} attacked ${the_playing_enemy.id} for ${player.ap} damage.`);
        if(the_playing_enemy.hp > 0) {
            player.hp -= the_playing_enemy.ap;
            $('#out_fightStatus').append(`\n${the_playing_enemy.id} attacked ${player.id} back for ${the_playing_enemy.ap} damage.`);
        }
        player.incrementAP();

        refreshHP();


        if(player.hp <= 0) {
            $('#out_fightStatus').append(` ${the_playing_enemy.id} defeated ${player.id}!`);
            prompt_restart();
            $('#out_fightStatus').append(' You lose!');
            setTimeout(function () {
                alert('Game over!');
            }, 500);
        } else if(the_playing_enemy.hp <= 0) {
            $('#out_fightStatus').append(` ${player.id} defeated ${the_playing_enemy.id}!`);
            select_enemy = false;
            for(let i = 0; i < characters.length; i++) {
                if(characters[i].id === the_playing_enemy.id) {
                    characters.splice(i, 1);
                }
            }
            $('.playing_enemy').remove();
        }

        if(characters.length === 1 && characters[0].type === 'player') {
            $('#out_fightStatus').append(' You win!');
            prompt_restart();
        }

        // console.log(characters);
    }

    //Restart button:
    $('#btn_restart').on('click', function() {
        location.reload();
    });

    const refreshHP = () => {
        $('.display').each(function(i, val) {
            // console.log($(this).children().eq(1));
            let $that = $(this);

            for(let i = 0; i < characters.length; i++) {
                if($that.attr('id').toLowerCase() === characters[i].id.toLowerCase()){
                    $that.children().eq(2).text(characters[i].hp);
                    $that.children().eq(0).text(characters[i].id);
                }
            }
        });
    }

    //Helper methods:
    const refresh = () => {
        let $selectable_enemies = $('.selectable_enemies');
        $($selectable_enemies).each(function(i, val) {
            $div_select_enemy.append($(this));
        });
    }

    const refresh2 = () => {
        // console.log('refresh2');
        let $selected_enemy = $('.playing_enemy');
        $div_playing_enemy.append($selected_enemy);
    }

    const prompt_restart = () => {
        $('#btn_fight').hide();
        $('#btn_restart').show();
    }

});

///--------------------workling----------------------
// $(document).on('click', '.chars',function() {
//     alert('chars detected');
//     if($(this).hasClass('chars')) {
//         alert('chars detected');
//     }
// });
///--------------------workling----------------------
