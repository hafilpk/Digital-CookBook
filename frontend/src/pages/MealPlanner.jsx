import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { startOfWeek, addDays, format } from "date-fns";
import api from "../services/api";

export default function MealPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [plan, setPlan] = useState({});

  useEffect(() => {
    async function fetchRecipes() {
      const res = await api.get("/recipes/");
      setRecipes(res.data);
    }
    fetchRecipes();

    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = [...Array(7)].map((_, i) => addDays(start, i));
    setWeekDays(days);

    setPlan(
      days.reduce((acc, d) => {
        acc[format(d, "yyyy-MM-dd")] = [];
        return acc;
      }, {})
    );
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === "recipes") {
      const recipe = recipes[source.index];
      const destDate = destination.droppableId;
      setPlan((prev) => ({
        ...prev,
        [destDate]: [...prev[destDate], recipe],
      }));
    } else {
      const sourceDate = source.droppableId;
      const destDate = destination.droppableId;

      const srcItems = Array.from(plan[sourceDate]);
      const [moved] = srcItems.splice(source.index, 1);

      const destItems = Array.from(plan[destDate]);
      destItems.splice(destination.index, 0, moved);

      setPlan((prev) => ({
        ...prev,
        [sourceDate]: srcItems,
        [destDate]: destItems,
      }));
    }
  };

  return (
    <div>
      <h2>Meal Planner</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          <div className="col-md-3">
            <h5>Recipes</h5>
            <Droppable droppableId="recipes" isDropDisabled>
              {(provided) => (
                <ul
                  className="list-group"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {recipes.map((r, i) => (
                    <Draggable
                      key={`recipe-${r.id}`}
                      draggableId={`recipe-${r.id}`}
                      index={i}
                    >
                      {(prov) => (
                        <li
                          className="list-group-item"
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                        >
                          {r.title}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          
          <div className="col-md-9">
            <div className="row">
              {weekDays.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                return (
                  <div key={dateKey} className="col border p-2">
                    <h6>{format(day, "EEE dd")}</h6>
                    <Droppable droppableId={dateKey}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-vh-25 bg-light p-2"
                        >
                          {plan[dateKey]?.map((r, i) => (
                            <Draggable
                              key={`${dateKey}-${r.id}-${i}`}
                              draggableId={`${dateKey}-${r.id}-${i}`}
                              index={i}
                            >
                              {(prov) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className="alert alert-secondary p-1 mb-1"
                                >
                                  {r.title}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
