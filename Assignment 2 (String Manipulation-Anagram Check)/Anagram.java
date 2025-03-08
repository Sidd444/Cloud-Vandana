import java.util.*;

class Anagram{
    public static void main(String args[]){
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter First String:");
        String s1=sc.nextLine();
        System.err.println("Enter Second String:");
        String s2=sc.nextLine();
        System.out.println(areAnagrams(s1, s2));
        sc.close();
    }
    private static boolean areAnagrams(String s1,String s2){
        if(s1.length()!=s2.length()) return false;
        Map<Character,Integer> hm1=new HashMap<>(), hm2=new HashMap<>();
        for(char c:s1.toCharArray()) hm1.put(c,hm1.getOrDefault(c,0)+1);
        for(char c:s2.toCharArray()) hm2.put(c,hm2.getOrDefault(c,0)+1);
        return hm1.equals(hm2);
    }
}