package com.example.yzhang17.nextadventure;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.Random;

/**
 * Created by yzhang17 on 9/19/2015.
 */
public abstract class Trainer {
    private final String name;
    private final String location;
    private final List<Nextie> underlings;
    private int techcash;
    private int currentUnderling = 0;
    public Trainer(String name, String location, List<Nextie> underlings, int maxTechcash){
        this.name = name;
        this.location = location;
        List<Nextie> temp = new ArrayList<Nextie>();
        Collections.copy(underlings, temp);
        Collections.shuffle(temp);
        this.underlings = Collections.unmodifiableList(temp);
        this.techcash = (new Random()).nextInt(maxTechcash);
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

    /**
     *
     * @return Amount of money dropped for beating this trainer
     */
    public int lose(){ return techcash; }

    public boolean canAttack(){
        return !underlings.get(currentUnderling).isDead();
    }

    @Override
    public String toString(){
        return name;
    }
}
