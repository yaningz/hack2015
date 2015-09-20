package com.example.yzhang17.nextadventure;
import java.util.List;
import java.util.Random;
import java.util.ArrayList;
import java.util.Collections;

/**
 * Created by yzhang17 on 9/19/2015.
 */
public class Nextie {

    private final String name;
    private final int maxHP;
    private final List<Move> moves;
    private int currentHP;
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

    }
}
