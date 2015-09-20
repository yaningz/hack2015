package com.example.yzhang17.nextadventure;

import java.util.List;

/**
 * Created by yzhang17 on 9/19/2015.
 */
public class GroupLeader extends Trainer {
    public GroupLeader(String name, String location, List<Nextie> underlings){
        super(name, location, underlings);
    }
    @Override
    public String speak() {
        return null;
    }
}
