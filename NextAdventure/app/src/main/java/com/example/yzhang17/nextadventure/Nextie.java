package com.example.yzhang17.nextadventure;
import java.util.List;
import java.util.Random;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Arrays;

/**
 * Created by yzhang17 on 9/19/2015.
 */
public class Nextie {

    private final String name;
    private final int maxHP;
    private final List<Move> moves;
    private int currentHP;
    private final Random movePicker = new Random();
    Nextie(String name, int hp, ArrayList<Move> moves){
        this.name = name;
        this.maxHP = hp;
        this.currentHP = hp;
        this.moves = Collections.unmodifiableList((List) moves);
    }

    /**
     *
     * @return List<Object> s.t. List.get(0) is the attack name, List.get(1) is the attack damage
     */
    public List<Object> attack(){
        int m = movePicker.nextInt(4);
        Move move = moves.get(m);
        int damage = move.makeMove();
        return Collections.unmodifiableList(Arrays.asList(new Object[]{move.getName(), new Integer(damage)}));
    }

    /**
     *
     * @param accuracy Rate at which the attack hits
     * @param power Base attack of the attack
     * @return damage dealt by the attack
     */
    public int amAttacked(double accuracy, int power){
        Random r = new Random();
        if(r.nextFloat() <= accuracy) {
            int damage = (int)((r.nextFloat()- .5) * power * .1 + power);
            currentHP -= damage;
            return damage;
        }
        return 0;
    }

    /**
     *
     * @return Am I dead yet?
     */
    public boolean amDead(){
        return currentHP <= 0;
    }
}
