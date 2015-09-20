package com.example.yzhang17.nextadventure;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

/**
 * Created by yzhang17 on 9/19/2015.
 */
public abstract class Trainer {
    private final String name;
    private final String location;
    private final List<Nextie> underlings;
    private int currentUnderling = 0;
    public Trainer(String name, String location, List<Nextie> underlings){
        this.name = name;
        this.location = location;
        List<Nextie> temp = new ArrayList<Nextie>();
        Collections.copy(underlings, temp);
        Collections.shuffle(temp);
        this.underlings = Collections.unmodifiableList(temp);
    }

    public String introduction(){
        return "Hi, my name is " + name + ". Welcome to the " + location +". Let's battle!";
    }

    public abstract String speak();

    public Nextie switchNextie(){
        if(currentUnderling < underlings.size()){
            currentUnderling++;
            return underlings.get(currentUnderling);
        }
        return null;
    }

    public String lose(){ return "Oh no!  I lost!"; }

    public boolean canAttack(){
        return !underlings.get(currentUnderling).isDead();
    }

    @Override
    public String toString(){
        return name;
    }
}
