import java.util.*;

class Employee {
    private int id;
    private String name;
    private double salary;

    public Employee(int id, String name, double salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }

    public void displayDetails() {
        System.out.println("ID: " + id + ", Name: " + name + ", Salary: " + salary);
    }
}

public class Manager {
    public static void main(String[] args) {
        Employee emp1 = new Employee(1, "Siddharth", 50000.70);
        Employee emp2 = new Employee(2, "Aryan", 60000.60);
        Employee emp3 = new Employee(3, "Manoj", 70000.50);

        List<Employee> employees = new ArrayList<>();
        employees.add(emp1);
        employees.add(emp2);
        employees.add(emp3);

        for (Employee emp : employees) emp.displayDetails();
    }
}
