import { request } from "http";
import Parse from "parse/node.js";

const badge_limit = 5;

Parse.Cloud.beforeSave("Game", () => {
    const state = request.object.get("state");
    const user1 = request.object.get("user1");
    const user2 = request.object.get("user2");
    if (state == "user1_won") {
        user2.object.set("current_win_streak", 0);
        if (user1.object.get("current_win_streak") + 1 > badge_limit) {
            user1.object.get("badges").add("badge1");
        }
    } else if (state == "user2_won") {
        user1.object.set("current_win_streak", 0);
        if (user2.object.get("current_win_streak") + 1 > badge_limit) {
            user2.object.get("badges").add("badge1");
        }
    } else if (state == "draw") {
        user1.object.set("current_win_streak", 0);
        user2.object.set("current_win_streak", 0);
    }
},
// {} 
// this can be used for validation
);