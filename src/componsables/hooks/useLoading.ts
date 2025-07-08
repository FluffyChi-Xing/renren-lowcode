/**
 * @description loading hooks
 * @author FluffyChi-Xing
 */
import { ref } from 'vue';



export default function useLoading(index: boolean = false) {
  const isLoading = ref<boolean>(index);


  const setLoading = (index: boolean) => {
    isLoading.value = index;
  };

  const toggle = () => {
    isLoading.value = !isLoading.value;
  }


  return {
    isLoading,
    setLoading,
    toggle
  };
}
