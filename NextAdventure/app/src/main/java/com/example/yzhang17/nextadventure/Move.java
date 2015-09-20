package com.example.yzhang17.nextadventure;

import java.util.Random;

/**
 * Created by yzhang17 on 9/19/2015.
 */
public class Move {
    private final double accuracy;
    private final String name;
    private final int power;

    Move(String name, double success, int power){
        this.accuracy = success;
        this.name = name;
        this.power = power;
    }

    /**
     * If hit is successful, deals damage within 10% of power
     * @return value of damage dealt by this move
     */
    public int makeMove(){
        Random r = new Random();
        if(r.nextFloat() <= accuracy) {
            return (int)((r.nextFloat()- .5) * power * .1 + power);
        }
        return 0;
    }

    public String getName(){
        return name;
    }

}
